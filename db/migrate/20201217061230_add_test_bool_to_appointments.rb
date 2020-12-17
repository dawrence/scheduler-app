class AddTestBoolToAppointments < ActiveRecord::Migration[5.2]
  def change
    add_column :appointments, :test, :boolean, default: false
  end
end
