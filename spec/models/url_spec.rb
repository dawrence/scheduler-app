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

  describe '#stats' do
    let!(:url) { FactoryBot.create(:url) }
    let!(:click_chrome) do
      FactoryBot.create(
        :click,
        url_id: url.id,
        created_at: Time.zone.now,
        browser: 'Chrome',
        platform: 'OS X'
      )
    end

    let!(:click_firefox) do
      FactoryBot.create(
        :click,
        url_id: url.id,
        created_at: Time.zone.now,
        browser: 'Firefox',
        platform: 'Windows'
      )
    end

    let!(:click_safari) do
      FactoryBot.create(
        :click,
        url_id: url.id,
        created_at: Time.zone.now + 1.day,
        browser: 'Safari',
        platform: 'OS X'
      )
    end

    let(:stats) { url.stats }

    it '#clicks_per_day' do
      expect(stats[:clicks_per_day]).to eq(2)
    end

    it '#browsers' do
      expect(stats[:browsers]).to eq('Chrome, Firefox, Safari')
    end

    it '#platforms' do
      expect(stats[:platforms]).to eq('OS X, Windows')
    end
  end
end
