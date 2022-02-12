import sql from "$lib/sql";

export async function get({params}) {
    const [transaction] = await sql`select * from transactions where id = ${params.id}`
    if (transaction) {
        return {body: transaction}
    }
    return {status: 404}
}

export async function del({params}) {
    const [id] = await sql`
        update transactions
        set is_deleted = true
        where id = ${params.id}
        returning id`
    if (id) {
        return {status: 204}
    }
    return {status: 404}
}