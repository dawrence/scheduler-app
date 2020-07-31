class ClickSerializer < ActiveModel::Serializer
  attributes :browser, :platform, :created_at
end
