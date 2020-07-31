# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'urls#index'

  get ':url', to: 'urls#visit', as: :visit

  namespace :api do
    namespace :v1 do
      resources :urls, only: %i[latest create show], param: :url
      get 'latest', to: 'urls#latest'
      get 'stats/:url', to: 'urls#stats'
    end
  end
end
