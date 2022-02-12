import sql from "$lib/sql";
import {Keypair} from "@solana/web3.js";

export async function post({request}) {
    const contentType = request.headers.get('content-type')?.toLowerCase()
    if (!contentType?.startsWith('application/x-www-form-urlencoded')) {
        return {
            status: 415,
            headers: {'content-type': 'text/plain'},
            body: 'Only the following media types are accepted: application/x-www-form-urlencoded'
        }
    }
    const data = await request.formData()
    if (!data.has('amount')) {
        return {status: 400, body: {message: `missing required parameter amount`}}
    }
    if (!data.has('recipient')) {
        return {status: 400, body: {message: `missing required parameter recipient`}}
    }
    const transaction = {
        amount: parseFloat(data.get('amount')),
        recipient: data.get('recipient'),
        label: data.get('label'),
        memo: data.get('memo'),
        message: data.get('message'),
        reference: new Keypair().publicKey.toBase58(),
    };
    const [entity] = await sql`insert into transactions ${sql(transaction)} returning id`
    return {status: 301, headers: {location: `/transactions/${entity.id}`}}
}

export async function get({request}) {
    const transactions = await sql`
        select id, amount, recipient, status, reference, label, memo, message 
        from transactions 
        where is_deleted = false`
    return {body: transactions}
}
