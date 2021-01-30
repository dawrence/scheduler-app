class AddLicenseTypeToAppointments < ActiveRecord::Migration[5.2]
  def change
    add_column :appointments, :license_type, :string, default: nil
  end
end
