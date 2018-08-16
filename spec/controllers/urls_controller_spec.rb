# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UrlsController, type: :controller do
  describe 'GET #index' do
    it 'shows the latest 10 URLs' do
      skip 'add test'
    end
  end

  describe 'POST #create' do
    it 'creates a new url' do
      skip 'add test'
    end
  end

  describe 'GET #show' do
    it 'shows stats about the given URL' do
      skip 'add test'
    end

    it 'throws 404 when the URL is not found' do
      skip 'add test'
    end
  end

  describe 'GET #visit' do
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
