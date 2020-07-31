# frozen_string_literal: true

# :nodoc:
class Encoder
  MAP_URL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  def self.encode(n)
    encoded = []
    while n.positive? do
      encoded << MAP_URL[n % 62]
      n /= 62
    end

    encoded.reverse.join
  end

  def self.decode(w)
    w.reverse.chars.map.with_index { |d, i| MAP_URL.index(d) * (62**i) }.sum
  rescue NoMethodError
    nil
  end
end
