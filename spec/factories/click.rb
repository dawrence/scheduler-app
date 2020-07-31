FactoryBot.define do
  factory :click do
    url_id { FactoryBot.create(:url).id }
    browser { 'Chrome' }
    platform { 'OS X' }
  end
end
