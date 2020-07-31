class CreateInstructors < ActiveRecord::Migration[5.2]
  def change
    create_table :instructors do |t|
      t.string :full_name, null: false
      t.string :id_number, null: false
      t.string :email, null: true, default: nil
      t.string :phone, null: true, default: nil
      t.integer :available_hours, default: 0, null: false
      t.timestamps
    end
  end
end
