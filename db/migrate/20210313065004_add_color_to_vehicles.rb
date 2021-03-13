class AddColorToVehicles < ActiveRecord::Migration[5.2]
  def change
    add_column :vehicles, :color, :string
  end
end
