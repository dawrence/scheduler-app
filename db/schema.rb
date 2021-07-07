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

ActiveRecord::Schema.define(version: 2021_04_24_052915) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_logs", force: :cascade do |t|
    t.integer "student_id"
    t.integer "user_id"
    t.json "student_info", default: {}
    t.json "user_info", default: {}
    t.string "action"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["student_id"], name: "index_action_logs_on_student_id"
    t.index ["user_id"], name: "index_action_logs_on_user_id"
  end

  create_table "appointments", force: :cascade do |t|
    t.integer "instructor_id"
    t.integer "vehicle_id"
    t.integer "student_id"
    t.datetime "start_at"
    t.datetime "end_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.boolean "test", default: false
    t.string "license_type"
    t.string "class_type", default: "practice"
  end

  create_table "cash_flows", force: :cascade do |t|
    t.float "amount", default: 0.0
    t.string "concept"
    t.integer "kind", default: 0
    t.integer "student_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["student_id"], name: "index_cash_flows_on_student_id"
  end

  create_table "fines", force: :cascade do |t|
    t.integer "student_id"
    t.integer "kind", default: 0
    t.float "value", default: 0.0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "paid", default: false
    t.index ["student_id"], name: "index_fines_on_student_id"
  end

  create_table "instructors", force: :cascade do |t|
    t.string "full_name", null: false
    t.string "id_number", null: false
    t.string "email"
    t.string "phone"
    t.integer "available_hours", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "license_type"
  end

  create_table "students", force: :cascade do |t|
    t.string "full_name", null: false
    t.string "email"
    t.string "phone"
    t.string "license_type"
    t.integer "age"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "id_number", null: false
    t.integer "available_hours", default: 0
    t.boolean "debtor", default: false
    t.integer "status", default: 0
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role", default: 1
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "vehicles", force: :cascade do |t|
    t.string "plate", null: false
    t.string "status"
    t.integer "available_hours", default: 0
    t.string "type", null: false
    t.json "additional_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "color"
    t.json "schedule", default: {"1"=>"allDAy", "2"=>"allDAy", "3"=>"allDAy", "4"=>"allDAy", "5"=>"allDAy", "6"=>"allDAy"}
  end

end
