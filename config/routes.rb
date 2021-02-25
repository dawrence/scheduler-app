# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users

  
  unauthenticated :user do
    devise_scope :user do
      get "/" => "devise/sessions#new"
    end
  end

  root to: 'appointments#index'


  namespace :api do
    namespace :v1 do
      resources :appointments, only: %i[index create destroy update]
      resources :vehicles, only: %i[index create update]
      namespace :vehicles do
        get 'available'
      end
      resources :instructors, only: %i[index create update destroy]
      namespace :instructors do
        get 'available'
      end
      resources :students, only: %i[index create update destroy]
      namespace :students do
        get 'available'
      end
    end
  end

  get '*path' => redirect('/')
end
