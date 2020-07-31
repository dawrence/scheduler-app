# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::UrlsController, type: :controller do
  render_views

  let(:original_url) { 'http://example.com' }

  let(:body) { response.body }
  let(:json_body) { JSON.parse body }
  let(:data) { json_body['data'] }

  let(:params) do
    { original_url: original_url }
  end

  context 'with data' do
    let!(:urls) { FactoryBot.create_list(:url, 20) }

    describe 'GET #latest' do
      it 'shows the latest 10 URLs' do
        get :latest
        expect(data.length).to be <= 10
        expect(data.length).to be > 0
      end
    end

    describe 'POST #create' do
      let(:data) { json_body['data'] }

      it 'creates a new url' do
        post :create, params: params
        url = Url.last
        expect(data).not_to be_empty
        expect(response.status).to eq(200)
        expect(data['attributes']['original-url']).to eq(original_url)
        expect(data['attributes']['url']).not_to be_empty
        expect(data['attributes']['url']).to eq("/#{url.short_url}")
      end

      it 'does not create a new url' do
        expect{
          post :create, params: { original_url: '' }
        }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

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
          expect(data['attributes']['clicks-count']).to eq(1)
          expect(data['attributes']['clicks'].length).to eq(1)
          expect(data['attributes']['clicks'].length).to eq(1)
        end
      end

      it 'throws 404 when the URL is not found' do
        get :visit, params: { url: 'someurl' }

        expect(response.status).to eq(404)
      end
    end

    describe 'GET #show' do
      let!(:url) { FactoryBot.create(:url) }
      let(:data) { json_body['data'] }
      let(:stats) { data['relationships']['metrics']['data'] }

      # create stats

      context 'with a given url' do
        before do
          get :show, params: { url: url.short_url }
        end

        it 'show data for the given url' do
          expect(response.status).to eq(200)
          expect(data['attributes']['original-url']).to eq(url.original_url)
          expect(data['attributes']['url']).not_to be_empty
          expect(data['attributes']['url']).to include(url.short_url)
        end

        xit 'shows stats about the given URL' do
          expect(response.status).to eq(200)
          expect(stats.size).to be > 1
        end
      end

      it 'throws 404 when the URL is not found' do
        get :show, params: { url: 'whatever' }

        expect(response.status).to eq(404)
      end
    end
  end

  context 'without data' do
    describe 'GET #latest' do
      it 'shows the latest 10 URLs' do
        get :latest
        expect(response.status).to eq(200)
        expect(data).to be_empty
      end
    end
  end

  xdescribe 'GET #stats' do
    it 'tracks click event and stores platform and browser information' do
      skip 'add test'
    end

    it 'redirects to the original url' do
      skip 'add test'
    end

    it 'throws 404 when the URL is not found' do
      skip 'add test'
    end
  end
end
