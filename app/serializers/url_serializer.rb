class UrlSerializer < ActiveModel::Serializer
  attributes :original_url, :url, :clicks_count,
             :short_url, :created_at, :clicks

  has_many :clicks, serializer: ClickSerializer

  def url
    "/#{object.short_url}"
  end

  def created_at
    object.created_at.strftime('%a %d %b %Y %H:%M:%S')
  end
end
