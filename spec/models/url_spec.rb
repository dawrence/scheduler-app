# frozen_string_literal: true

require 'rails_helper'

require './lib/encoder'

RSpec.describe Url, type: :model do

  context 'validations' do
    let(:subject) { FactoryBot.build(:url) }

    describe '#original_url' do
      it 'valid with a valid url' do
        expect(subject).to be_valid
      end

      it 'invalid with an invalid url' do
        subject.original_url = 'whatever'
        expect(subject).not_to be_valid
      end
    end

    describe '#short_url' do
      let(:other_url) { FactoryBot.build(:url) }

      before do
        subject.save!
      end

      it 'generates an unique short_url' do
        other_url.short_url = subject.short_url
        expect(other_url).not_to be_valid
      end

      it 'generates a short_url' do
        expect(subject.short_url).not_to be_nil
      end

      it 'generates a valid short_url' do
        expect(Encoder.decode(subject.short_url)).to eq(subject.id)
      end

      it 'does not include special chars' do
        subject.short_url = ' $%# '
        expect(subject).not_to be_valid
      end
    end
  end

  describe '#latest' do
    let!(:list) { FactoryBot.create_list(:url, 20) }

    it 'limits to 10 results' do
      expect(Url.latest.length).to be <= 10
      expect(Url.latest.length).to be > 0
    end
  end
end
