/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(1000)', notNull: true },
    createdAt: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    lastLogin: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    email: { type: 'varchar(1000)', notNull: true, unique: true },
  });
  pgm.createTable('tasks', {
    id: 'id',
    assigneeId: { type: 'integer', notNull: false, references: '"users"', onDelete: 'cascade' },
    name: { type: 'varchar(1000)', notNull: true },
    createdAt: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    dueDate: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func("date_trunc('week', current_timestamp) + interval '6 days 23 hours 59 minutes 59 seconds'")
    },
    done: { type: 'boolean', notNull: true, default: 'false' },
    comment: { type: 'varchar(1000)', notNull: false }
  });
  pgm.createTable('sessions', {
    id: 'id',
    userId: { type: 'integer', notNull: true, references: '"users"', onDelete: 'cascade', unique: true },
    sessionId: { type: 'integer', notNull: true },
    connected: { type: 'boolean', notNull: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('tasks');
  pgm.dropTable('sessions');
  pgm.dropTable('users');
};
