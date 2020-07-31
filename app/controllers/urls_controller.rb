# frozen_string_literal: true

class UrlsController < ApplicationController
  def visit
    @url = Url.find_by!(short_url: params[:url])

    redirect_to @url.original_url, status: 302 if @url.perform_click!(
      browser.name,
      browser.platform
    )
  end
end
