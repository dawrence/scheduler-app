# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'appointments#index'

  namespace :api do
    namespace :v1 do
      resources :appointments, only: %i[index create show]
      resources :vehicles, only: %i[index create show]
      resources :instructors, only: %i[index create show]
      resources :students, only: %i[index create show]
    end
  end
end
