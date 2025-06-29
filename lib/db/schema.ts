/* eslint-disable @typescript-eslint/no-unused-vars */
import {pgTable, text, uuid, integer, boolean, timestamp} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
        id: uuid("id").primaryKey().defaultRandom(),

        // basic file info
        name: text("name").notNull(),
        path: text("path").notNull(),
        size:integer("size").notNull(),
        type: text("type").notNull(),

        // file metadata
        fileUrl: text("file_url"),
        thumbnailUrl: text("thumbnail_url").notNull(),

        // ownership 
        userId: text("user_id").notNull(),
        parentId: uuid("parent_id"), // parent folder id (null for root folder)

        // file/folder flags
        isFolder: boolean("is_folder").notNull().default(false),
        isStarred: boolean("is_starred").notNull().default(false),
        isDeleted: boolean("is_deleted").notNull().default(false),

        // timestamps 
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

/*
    Parent: each file/folder can have one parent folder 
    Children: each folder can have many files/folders
*/

export const filesrelations = relations(files, ({one, many}) => ({
        parent: one(files, {
                fields: [files.parentId],
                references: [files.id]
        }),

        children: many(files)
}))

export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert;