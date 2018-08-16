# frozen_string_literal: true

class CreateUrls < ActiveRecord::Migration[5.2]
  def change
    create_table :urls do |t|
      t.timestamps default: -> { 'NOW()' }
      t.string :short_url, null: false
      t.string :original_url, null: false
      t.integer :clicks_count, default: 0
    end
  end
end
