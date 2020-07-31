FactoryBot.define do
  factory :url do
    original_url { 'http://www.whatever.com/index' }
    clicks_count { 0 }
  end
end
