# frozen_string_literal: true

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20_180_816_185_151) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'plpgsql'

  create_table 'clicks', force: :cascade do |t|
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.bigint 'url_id'
    t.string 'browser', null: false
    t.string 'platform', null: false
    t.index ['url_id'], name: 'index_clicks_on_url_id'
  end

  create_table 'urls', force: :cascade do |t|
    t.datetime 'created_at', default: -> { 'now()' }, null: false
    t.datetime 'updated_at', default: -> { 'now()' }, null: false
    t.string 'short_url', null: false
    t.string 'original_url', null: false
    t.integer 'clicks_count', default: 0
  end

  add_foreign_key 'clicks', 'urls'
end
