import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

export async function createTestDbConnection(
  entities: any[],
): Promise<DataSource> {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'version',
  });

  const connection = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities,
  });

  await connection.initialize();
  await connection.synchronize();

  return connection;
}
