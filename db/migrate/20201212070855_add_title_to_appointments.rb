class AddTitleToAppointments < ActiveRecord::Migration[5.2]
  def change
    add_column :appointments, :title, :string
  end
end
