class AddAvailableHoursToStudents < ActiveRecord::Migration[5.2]
  def change
    add_column :students, :available_hours, :integer, default: 0
  end
end
