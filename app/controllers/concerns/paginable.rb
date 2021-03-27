# frozen_string_literal: true

# fuck this comment
module Paginable
  extend ActiveSupport::Concern

  def page
    params[:page] || 1
  end

  def per_page
    params[:per_page] || 25
  end
end
