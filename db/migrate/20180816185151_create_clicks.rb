# frozen_string_literal: true

class CreateClicks < ActiveRecord::Migration[5.2]
  def change
    create_table :clicks do |t|
      t.timestamps
      t.references :url, foreign_key: true
      t.string :browser, null: false
      t.string :platform, null: false
    end
  end
end
