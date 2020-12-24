class AddLicencesToInstructors < ActiveRecord::Migration[5.2]
  def change
    add_column :instructors, :license_type, :string, default: nil
  end
end
