# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UrlsController, type: :controller do
  describe '#visit' do
    context 'url found' do
      let!(:url) { FactoryBot.create(:url, clicks_count: 0) }

      before do
        get :visit, params: { url: url.short_url }
      end

      it 'increases click_counts' do
        url.reload
        expect(url.clicks_count).to eq(1)
      end

      it 'creates a new click for this url' do
        expect(url.clicks.length).to eq(1)
      end

      it 'redirects to the original url' do
        expect(response.status).to eq(302)
      end
    end

    it 'throws 404 when the URL is not found' do
      expect{ get :visit, params: { url: 'someurl' } }.to(
        raise_error(ActiveRecord::RecordNotFound)
      )
    end
  end
end
