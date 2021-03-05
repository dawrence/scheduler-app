# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users

  unauthenticated :user do
    devise_scope :user do
      get "/" => "devise/sessions#new"
    end
  end

  resources :students, only: %i[show]

  root to: 'appointments#index'


  namespace :api do
    namespace :v1 do
      get :active_user, to: 'users#active_user'
      resources :action_logs, only: %i[index]
      resources :appointments, only: %i[index create destroy update]
      resources :vehicles, only: %i[index create update]
      namespace :vehicles do
        get 'available'
      end
      resources :instructors, only: %i[index create update destroy]
      namespace :instructors do
        get 'available'
      end
      resources :students, only: %i[index create update destroy] do
        post :mark_as_debtor, on: :member, path: 'debtor/mark'
        post :unmark_as_debtor, on: :member, path: 'debtor/unmark'
        post :set_fine, on: :member, path: 'fine/set'
        post :pay_fine, on: :member, path: 'fine/pay'
      end
      namespace :students do
        get 'available'
      end
    end
  end

  get '*path' => redirect('/')
end
