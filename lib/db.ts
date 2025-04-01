import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

declare global {
	var prisma: PrismaClient | undefined;
}

// Only import ws in Node.js environment
let ws;
if (process.env.NODE_ENV !== 'production') {
	ws = require('ws');
	neonConfig.webSocketConstructor = ws;
}

// Check if we're in an Edge runtime
const isEdge = process.env.NEXT_RUNTIME === 'edge';

let prisma: PrismaClient;

if (isEdge) {
	// Edge runtime configuration
	const connectionString = process.env.DATABASE_URL!;
	const pool = new Pool({ connectionString });
	const adapter = new PrismaNeon(pool);
	prisma = new PrismaClient({ adapter });
} else {
	// Node.js runtime configuration
	if (process.env.NODE_ENV === 'production') {
		prisma = new PrismaClient();
	} else {
		if (!global.prisma) {
			global.prisma = new PrismaClient();
		}
		prisma = global.prisma;
	}
}

export const db = prisma;
