# frozen_string_literal: true

require './lib/encoder'

# :nodoc:
class Url < ApplicationRecord
  scope :latest, -> { limit(10).order(created_at: :desc) }

  has_many :clicks

  after_create :create_short_url

  validates :original_url, presence: true, format: {
    with: URI::DEFAULT_PARSER.make_regexp, message: 'not a valid url'
  }

  validates :short_url, uniqueness: true, format: {
    with: /\A([a-zA-Z]|\d)*\z/, message: 'Cannot contain special chars'
  }

  def perform_click!(browser_name, platform)
    Click.create!(
      browser: browser_name,
      platform: platform,
      url_id: id
    )

    update_attributes!(clicks_count: clicks_count + 1)
  end

  private

  def create_short_url
    update_attribute(:short_url, Encoder.encode(id))
  end
end
