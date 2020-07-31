class CreateVehicles < ActiveRecord::Migration[5.2]
  def change
    create_table :vehicles do |t|
      t.string :plate, null: false
      t.string :status, null: true, default: nil
      t.integer :available_hours, default: 0
      t.string :type, null: false
      t.json :additional_data, default: nil, null: true
      t.timestamps
    end
  end
end
