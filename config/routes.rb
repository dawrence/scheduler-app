Rails.application.routes.draw do
  root to: 'pages#index'
  # Remove these routes and add yours
  get 'urls', to: 'pages#index'
  get 'stats', to: 'pages#stats'
end
