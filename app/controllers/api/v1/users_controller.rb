class Api::V1::UsersController < ApplicationController

  def active_user
    if user_signed_in?
      render json: current_user
    else
      render json: '{"error": "Unauthorized"}', status: :unauthorized
    end
  end

end
