class CreateFines < ActiveRecord::Migration[5.2]
  def change
    create_table :fines do |t|
      t.integer :student_id
      t.integer :kind, default: 0
      t.float :value, default: 0.0

      t.timestamps
    end
    add_index :fines, :student_id
  end
end
