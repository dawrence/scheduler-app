# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Click, type: :model do
  let(:subject) { FactoryBot.build(:click) }

  describe 'validations' do
    it 'validates url_id is valid' do
      subject.url_id = nil
      expect(subject).not_to be_valid
    end

    it 'validates browser is not null' do
      subject.browser = nil
      expect(subject).not_to be_valid
    end

    it 'validates platform is not null' do
      subject.platform = nil
      expect(subject).not_to be_valid
    end
  end
end
