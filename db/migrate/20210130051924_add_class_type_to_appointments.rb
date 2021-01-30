class AddClassTypeToAppointments < ActiveRecord::Migration[5.2]
  def change
    add_column :appointments, :class_type, :string, default: 'practice'
  end
end
