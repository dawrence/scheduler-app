class CreateActionLogs < ActiveRecord::Migration[5.2]
  def change
    create_table :action_logs do |t|
      t.integer :student_id
      t.integer :user_id
      t.json :student_info, default: {}
      t.json :user_info, default: {}
      t.string :action
      t.text :content

      t.timestamps
    end
    add_index :action_logs, :student_id
    add_index :action_logs, :user_id
  end
end
