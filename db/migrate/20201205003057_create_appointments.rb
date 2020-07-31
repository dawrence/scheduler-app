class CreateAppointments < ActiveRecord::Migration[5.2]
  def change
    create_table :appointments do |t|
      t.integer :instructor_id
      t.integer :vehicle_id
      t.integer :student_id
      t.datetime :start_at
      t.datetime :end_at
      t.timestamps
    end
  end
end
