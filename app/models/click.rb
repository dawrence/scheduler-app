# frozen_string_literal: true

class Click < ApplicationRecord
  belongs_to :url

  scope :today, -> { where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day) }

  validates :browser, :platform, :url_id, presence: true
end
