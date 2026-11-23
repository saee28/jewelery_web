const db=require('../db');
exports.summary=async(req,res)=>{const {rows}=await db.query(`SELECT (SELECT count(*) FROM users WHERE role='customer') AS customers,(SELECT count(*) FROM products WHERE active=true) AS products,(SELECT count(*) FROM orders) AS orders,(SELECT COALESCE(sum(total),0) FROM orders WHERE payment_status='Paid' AND status!='Cancelled') AS revenue,(SELECT count(*) FROM orders WHERE status='Pending') AS pending`);res.json(rows[0]);};
exports.reports = async (req, res) => {
    const totals = (
        await db.query(`
            SELECT
                to_char(
                    date_trunc('month', created_at),
                    'YYYY-MM'
                ) AS "month",
                count(*) AS orders,
                COALESCE(
                    sum(
                        CASE
                            WHEN payment_status = 'Paid'
                             AND status != 'Cancelled'
                            THEN total
                            ELSE 0
                        END
                    ),
                    0
                ) AS revenue
            FROM orders
            GROUP BY 1
            ORDER BY 1 DESC
            LIMIT 12
        `)
    ).rows;

    const top = (
        await db.query(`
            SELECT
                product_name,
                sum(quantity) AS units,
                sum(subtotal) AS sales
            FROM order_items
            GROUP BY product_name
            ORDER BY units DESC
            LIMIT 10
        `)
    ).rows;

    const statuses = (
        await db.query(`
            SELECT
                status,
                count(*) AS orders
            FROM orders
            GROUP BY status
            ORDER BY status
        `)
    ).rows;

    res.json({ monthly: totals, top, statuses });
};
exports.users=async(req,res)=>res.json((await db.query("SELECT id,name,email,phone,active,created_at FROM users WHERE role='customer' ORDER BY id DESC")).rows);
exports.user=async(req,res)=>{const u=await db.query('SELECT id,name,email,phone,address,active,created_at FROM users WHERE id=$1 AND role=$2',[req.params.id,'customer']);if(!u.rowCount)return res.status(404).json({error:'User not found'});res.json({...u.rows[0],orders:(await db.query('SELECT id,total,status,created_at FROM orders WHERE user_id=$1 ORDER BY id DESC',[req.params.id])).rows});};
exports.updateUser=async(req,res)=>{const r=await db.query("UPDATE users SET active=$1 WHERE id=$2 AND role='customer' RETURNING id,active",[Boolean(req.body.active),req.params.id]);if(!r.rowCount)return res.status(404).json({error:'User not found'});res.json(r.rows[0]);};
