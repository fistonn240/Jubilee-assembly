import serverless from 'serverless-http'
import app from '../../server/index.js'

const expressHandler = serverless(app)

export async function handler(event, context) {
	try {
		return await expressHandler(event, context)
	} catch (error) {
		console.error('Netlify API function failed:', error)
		return {
			statusCode: 500,
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ error: 'API function failed to process the request.' }),
		}
	}
}