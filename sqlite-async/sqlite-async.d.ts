export = Database;
declare class Database {
  static get OPEN_READONLY(): number;
  static get OPEN_READWRITE(): number;
  static get OPEN_CREATE(): number;
  static open(filename: string, mode?: number): Promise<Database>;
  open(filename: string, mode?: number): Promise<Database>;
  db: import("sqlite3").Database;
  filename: string;
  close(fn?: (db: Database) => Promise<any>): Promise<Database | any>;
  run(...args: any[]): Promise<{ lastID: number; changes: number }>;
  get(...args: any[]): Promise<any>;
  all(...args: any[]): Promise<any[]>;
  each(...args: Function[]): Promise<number>;
  exec(sql: string): Promise<Database>;
  transaction(fn?: (db: Database) => Promise<any>): Promise<any>;
  prepare(...args: any[]): Promise<Statement>;
}
declare class Statement {
  constructor(statement: import("sqlite3").Statement);
  statement: import("sqlite3").Statement;
  bind(...args: any[]): Promise<Statement>;
  reset(): Promise<Statement>;
  finalize(): Promise<void>;
  run(...args: any[]): Promise<{ lastID: number; changes: number }>;
  get(...args: any[]): Promise<any>;
  all(...args: any[]): Promise<any[]>;
  each(...args: Function[]): Promise<number>;
}
