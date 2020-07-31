class CreateStudents < ActiveRecord::Migration[5.2]
  def change
    create_table :students do |t|
      t.string :full_name, null: false
      t.string :email, null: true, default: nil
      t.string :phone, null: true, default: nil
      t.string :license_type, default: nil
      t.integer :age
      t.timestamps
    end
  end
end
