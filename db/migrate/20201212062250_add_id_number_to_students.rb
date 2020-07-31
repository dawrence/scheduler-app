class AddIdNumberToStudents < ActiveRecord::Migration[5.2]
  def change
    add_column :students, :id_number, :string, null: false
  end
end
