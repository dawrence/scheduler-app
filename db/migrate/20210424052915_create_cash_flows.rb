class CreateCashFlows < ActiveRecord::Migration[5.2]
  def change
    create_table :cash_flows do |t|
      t.float :amount, default: 0.0
      t.string :concept
      t.integer :kind, default: 0
      t.integer :student_id

      t.timestamps
    end
    add_index :cash_flows, :student_id
  end
end
