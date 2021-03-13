class AddScheduleToVehicles < ActiveRecord::Migration[5.2]
  def change
    add_column :vehicles, :schedule, :json, default: { "1" => "allDAy",  "2" => "allDAy",  "3" => "allDAy", "4" => "allDAy", "5" => "allDAy", "6" => "allDAy"}
  end
end
