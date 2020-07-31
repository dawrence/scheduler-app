# frozen_string_literal: true

require 'rails_helper'
require './lib/encoder'

RSpec.describe Encoder do
  describe '#encode' do
    it 'encodes a big integer to a base 62' do
      expect(Encoder.encode(12_345)).to eq('3d7')
    end

    it 'encodes a really big integer to a base 62' do
      expect(Encoder.encode(12_333_345_234)).to eq('dsFsv8')
    end
  end

  describe '#decode' do
    it 'decodes a string in base 62 to a big integer' do
      expect(Encoder.decode('3d7')).to eq(12_345)
    end

    it 'decodes a string with unknown chars' do
      expect(Encoder.decode('3d$%3@$#7')).to eq(nil)
    end
  end
end
