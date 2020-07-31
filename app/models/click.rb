# frozen_string_literal: true

class Click < ApplicationRecord
  belongs_to :url

  validates :browser, :platform, :url_id, presence: true
end
