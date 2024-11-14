import 'server-only';

// import {
//   mysqlTable,
//   text,
//   decimal,
//   int,
//   timestamp,
//   mysqlEnum,
//   serial
// } from 'drizzle-orm/mysql-core';
// import { count, DrizzleConfig, eq, ilike } from 'drizzle-orm';
// import { createInsertSchema } from 'drizzle-zod';
// import { drizzle } from "drizzle-orm/mysql2";

// const db = drizzle(process.env.DATABASE_URL);


// export const statusEnum = mysqlEnum('status', [
//   'active',
//   'inactive',
//   'archived'
// ]);

// export const products = mysqlTable('products', {
//   id: serial('id').primaryKey(),
//   imageUrl: text('image_url').notNull(),
//   name: text('name').notNull(),
//   status: statusEnum.notNull(),
//   price: decimal('price', { precision: 10, scale: 2 }).notNull(),
//   stock: int('stock').notNull(),
//   availableAt: timestamp('available_at').notNull()
// });

// export type SelectProduct = typeof products.$inferSelect;
// export const insertProductSchema = createInsertSchema(products);

// export async function getProducts(
//   search: string,
//   offset: number
// ): Promise<{
//   products: SelectProduct[];
//   newOffset: number | null;
//   totalProducts: number;
// }> {
//   // Always search the full table, not per page
//   if (search) {
//     return {
//       products: await db
//         .select()
//         .from(products)
//         .where(ilike(products.name, `%${search}%`))
//         .limit(1000),
//       newOffset: null,
//       totalProducts: 0
//     };
//   }

//   if (offset === null) {
//     return { products: [], newOffset: null, totalProducts: 0 };
//   }

//   let totalProducts = await db.select({ count: count() }).from(products);
//   let moreProducts = await db.select().from(products).limit(5).offset(offset);
//   let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

//   return {
//     products: moreProducts,
//     newOffset,
//     totalProducts: totalProducts[0].count
//   };
// }

// export async function deleteProductById(id: number) {
//   await db.delete(products).where(eq(products.id, id));
// }
